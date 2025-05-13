from mysql.connector import connect, Error
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys

class Database:
    def __init__(self):
        try:
            self.connection = connect(
                host="localhost",
                user="root",
                password="sapna08",
                database="personal_details_form"
            )
            print("Database connection successful")
        except Error as e:
            print(f"Database connection error: {e}")
            raise

    def create_table(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS personal_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            salutation VARCHAR(10),
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            email VARCHAR(100) NOT NULL,
            birth_date DATE NOT NULL,
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(create_table_query)
                self.connection.commit()
                print("Table created/verified successfully")
        except Error as e:
            print(f"Error creating table: {e}")
            raise

    def insert_person_details(self, salutation, first_name, last_name, gender, email, birth_date, address):
        insert_query = """
        INSERT INTO personal_details 
        (salutation, first_name, last_name, gender, email, birth_date, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        data = (salutation, first_name, last_name, gender, email, birth_date, address)
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(insert_query, data)
                self.connection.commit()
                print("Data inserted successfully")
        except Error as e:
            print(f"Error inserting data: {e}")
            raise

    def close_connection(self):
        if self.connection:
            self.connection.close()
            print("Database connection closed")

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            print("\nReceived form data:", json.dumps(data, indent=2))

            db = Database()
            db.create_table()
            db.insert_person_details(
                data['salutation'],
                data['firstName'],
                data['lastName'],
                data['gender'],
                data['email'],
                data['birthDate'],
                data['address']
            )
            db.close_connection()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {'success': True, 'message': 'Data saved successfully!'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            print("\nData saved successfully to database!")
            
        except Exception as e:
            error_message = str(e)
            print(f"\nError processing request: {error_message}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {'success': False, 'message': error_message}
            self.wfile.write(json.dumps(response).encode('utf-8'))

if __name__ == '__main__':
    try:
        server = HTTPServer(('localhost', 5000), RequestHandler)
        print('\nServer running on http://localhost:5000')
        print('Press Ctrl+C to stop the server...\n')
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down the server...')
        server.socket.close()
    except Exception as e:
        print(f"\nServer error: {e}", file=sys.stderr)
        sys.exit(1)
