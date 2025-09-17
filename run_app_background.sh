#!/usr/bin/env bash
set -euo pipefail

APP_COMMAND=${APP_COMMAND:-"python app.py"}
LOG_DIR=${LOG_DIR:-"logs"}
PID_FILE="$LOG_DIR/app_background.pid"
RUNNER_LOG="$LOG_DIR/background_runner.log"
APP_LOG="$LOG_DIR/app_stdout.log"
RESTART_DELAY=${RESTART_DELAY:-5}
current_child_pid=0

ensure_log_dir() {
  mkdir -p "$LOG_DIR"
}

handle_exit() {
  local ts
  ts=$(date "+%Y-%m-%d %H:%M:%S%z")
  echo "[$ts] Background runner received termination signal. Shutting down."
  if [[ ${current_child_pid:-0} -ne 0 ]]; then
    if kill -0 "$current_child_pid" 2>/dev/null; then
      kill -- -"$current_child_pid" 2>/dev/null || true
      wait "$current_child_pid" 2>/dev/null || true
    fi
    current_child_pid=0
  fi
  rm -f "$PID_FILE"
  exit 0
}

is_running() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid=$(<"$PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

start_runner() {
  ensure_log_dir
  if is_running; then
    echo "Background runner is already active (PID $(cat "$PID_FILE"))."
    echo "Use '$0 status' to check its status or '$0 stop' to stop it first."
    return 0
  fi

  touch "$RUNNER_LOG" "$APP_LOG"
  nohup "$0" __run_loop >>"$RUNNER_LOG" 2>&1 &
  local pid=$!
  echo "$pid" >"$PID_FILE"
  if command -v disown >/dev/null 2>&1; then
    disown "$pid" 2>/dev/null || true
  fi
  echo "Started background runner (PID $pid)."
  echo "Runner log: $RUNNER_LOG"
  echo "Application log: $APP_LOG"
}

stop_runner() {
  if ! [[ -f "$PID_FILE" ]]; then
    echo "No PID file found. The background runner does not appear to be running."
    return 0
  fi

  local pid
  pid=$(<"$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    echo "Sent SIGTERM to background runner (PID $pid)."
  else
    echo "PID file existed but process $pid is not running. Cleaning up PID file."
  fi
  rm -f "$PID_FILE"
}

runner_status() {
  if is_running; then
    echo "Background runner is active (PID $(cat "$PID_FILE"))."
    echo "Runner log: $RUNNER_LOG"
    echo "Application log: $APP_LOG"
  else
    echo "Background runner is not running."
  fi
}

show_logs() {
  ensure_log_dir
  echo "Runner log (tail -n 20):"
  tail -n 20 "$RUNNER_LOG" 2>/dev/null || echo "No runner log yet."
  echo
  echo "Application log (tail -n 20):"
  tail -n 20 "$APP_LOG" 2>/dev/null || echo "No application log yet."
}

run_loop() {
  ensure_log_dir
  trap handle_exit SIGTERM SIGINT
  while true; do
    local start_ts
    start_ts=$(date "+%Y-%m-%d %H:%M:%S%z")
    echo "[$start_ts] Starting background command: $APP_COMMAND"
    set +e
    setsid bash -c "$APP_COMMAND" >>"$APP_LOG" 2>&1 &
    current_child_pid=$!
    wait "$current_child_pid"
    local exit_code=$?
    current_child_pid=0
    set -e
    local end_ts
    end_ts=$(date "+%Y-%m-%d %H:%M:%S%z")
    echo "[$end_ts] Command exited with status $exit_code. Restarting in ${RESTART_DELAY}s."
    sleep "$RESTART_DELAY"
  done
}

usage() {
  cat <<USAGE
Usage: $0 <command>

Commands:
  start   Start the background runner that keeps the app alive.
  stop    Stop the background runner.
  status  Print whether the runner is active.
  logs    Show the latest runner and application logs.

Environment variables:
  APP_COMMAND   Command to execute (default: "python app.py").
  LOG_DIR       Directory to store logs and PID file (default: "logs").
  RESTART_DELAY Seconds to wait before restarting the command (default: 5).
USAGE
}

case "${1:-}" in
  start)
    start_runner
    ;;
  stop)
    stop_runner
    ;;
  status)
    runner_status
    ;;
  logs)
    show_logs
    ;;
  __run_loop)
    run_loop
    ;;
  *)
    usage
    if [[ "${1:-}" != "" ]]; then
      exit 1
    fi
    ;;
esac
