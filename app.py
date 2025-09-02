from flask import Flask, send_file

app = Flask(__name__)


@app.route('/')
def index():
    return send_file('dark_sales_forecaster.html')


@app.route('/dark_sales_forecaster.html')
def dark():
    return send_file('dark_sales_forecaster.html')



@app.route('/favicon.svg')
def favicon_svg():
    return send_file('favicon.svg', mimetype='image/svg+xml')


@app.route('/favicon.ico')
def favicon_ico():
    return send_file('favicon.svg', mimetype='image/svg+xml')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5173, debug=True)
