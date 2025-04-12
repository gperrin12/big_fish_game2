from flask import Flask, render_template, send_from_directory
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable debug mode for development
app.config['DEBUG'] = True

@app.route('/')
def index():
    logger.info("Serving index page")
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                              'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.after_request
def add_header(response):
    # Cache control
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))  # Using port 8080 which is commonly available
    logger.info(f"Starting server on port {port}")
    app.run(host='127.0.0.1', port=port, debug=True)  # Use 127.0.0.1 instead of 0.0.0.0