# flask-project

## Installation

### Requirements

* Install [Python 3.x](https://www.python.org/downloads/release)

### Setting up a Virtual Environment

1. Install *virtualenv* with the command `pip install virtualenv`
1. Create a new virtual environment with `virtualenv venv`
1. Start the virtual environment by running `.\venv\Scripts\activate`
1. Install the necessary python packages with this command:
    ```
    pip install flask flask-caching waitress python-dotenv
    ```

Run the command `deactivate` to exit the virtual environment when done

### Setting the environment variables

* Create/Set the environment variable `DBG_SERVICE_ID` to your Daybreak Games issued Service ID in a `.env` file

## Running

1. Start the virtual environment by running `.\venv\Scripts\activate`
1. Use the command `python app.py` to start the application
1. Open your browser and navigate to [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

Run the command `deactivate` to exit the virtual environment when done