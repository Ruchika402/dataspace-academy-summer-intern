from flask import jsonify

def register_routes(app):

    @app.route("/")
    def home():
        return jsonify({
            "project": "Customer Categorization System",
            "version": "1.0.0",
            "status": "running"
        })
