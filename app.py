from flask import Flask, send_file

app = Flask(__name__)


@app.route('/')
def index():
    return send_file('advanced_sales_forecasting.html')


@app.route('/favicon.svg')
def favicon_svg():
    return send_file('favicon.svg', mimetype='image/svg+xml')


@app.route('/favicon.ico')
def favicon_ico():
    return send_file('favicon.svg', mimetype='image/svg+xml')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
