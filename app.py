from flask import Flask, send_from_directory, url_for

# ensure Flask serves files from the 'static' folder at '/static'
app = Flask(__name__, static_folder='static', static_url_path='/static')


@app.route('/')
def index():
    # serve the main HTML from the 'src' directory
    return send_from_directory('', 'dark_sales_forecaster.html')

@app.route('/dark_sales_forecaster.html')
def dark():
    return send_from_directory('', 'dark_sales_forecaster.html')

@app.route('/src/dark_sales_forecaster.html')
def srcdark():
    return send_from_directory('src', 'dark_sales_forecaster.html')

@app.route('/src/dark_sales_forecaster.css')
def srccssdark():
    return send_from_directory('src', 'dark_sales_forecaster.css')

@app.route('/src/dark_sales_forecaster.js')
def srcjsdark():
    return send_from_directory('src', 'dark_sales_forecaster.js')

# Place your CSS and JS files in the 'static' directory (e.g., 'static/dark_sales_forecaster.css' and 'static/dark_sales_forecaster.js')
# Flask will serve them automatically at '/static/dark_sales_forecaster.css' and '/static/dark_sales_forecaster.js'
# In your HTML, reference them either with an absolute path like /static/dark_sales_forecaster.css
# or using Jinja: {{ url_for('static', filename='dark_sales_forecaster.css') }}


@app.route('/favicon.svg')
def favicon_svg():
    return send_from_directory('static', 'favicon.svg', mimetype='image/svg+xml')


@app.route('/favicon.ico')
def favicon_ico():
    return send_from_directory('static', 'favicon.svg', mimetype='image/svg+xml')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5173, debug=True)
