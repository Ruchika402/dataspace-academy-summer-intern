from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {
        "project": "Customer Categorization System",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
