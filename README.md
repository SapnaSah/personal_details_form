# Personal Details Form

A modern, responsive web form application with real-time validation and MySQL database integration. Built using HTML, CSS, JavaScript, and Python.

## Screenshots

### Form Input View
![ss1](https://github.com/user-attachments/assets/aea0baa1-f35e-4e0a-b778-e9a58f8880e3)

### User Enrty View
![ss2](https://github.com/user-attachments/assets/edb04348-c81c-4aa4-9859-3c3cd0e381d8)

### Registration Success View
![ss3](https://github.com/user-attachments/assets/6739701d-5b98-4a2c-9db0-357ea54d4c31)

## Features

- Clean and modern UI design
- Real-time form validation
- Responsive layout
- MySQL database integration
- Animated success/error messages
- Form data persistence
- Cross-browser compatibility

## Tech Stack

- Frontend:
  - HTML5
  - CSS3 (with CSS Variables)
  - JavaScript (ES6+)
  - Animate.css for animations

- Backend:
  - Python
  - MySQL Database
  - HTTP Server
  - JSON for data transfer

## Requirements

- Python 3.x
- MySQL Server
- MySQL Connector for Python
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GoogleForm
```

2. Install Python dependencies:
```bash
pip install mysql-connector-python
```

3. Configure MySQL:
- Make sure MySQL server is running
- Create a database named 'personal_details_form'
- Update database credentials in `database.py` if needed

## Project Structure

```
GoogleForm/
│
├── index.html          # Main HTML form
├── style.css          # CSS styles
├── script.js          # Frontend JavaScript
├── database.py        # Python backend server
└── README.md          # Documentation
```

## Running the Application

1. Start the Python server:
```bash
python database.py
```

2. Open `index.html` in a web browser

The server will run on `http://localhost:5000`

## Form Fields

- Salutation (Mr., Ms., Mrs., Dr., Prof.)
- First Name (required)
- Last Name (required)
- Gender (required)
- Email (required)
- Date of Birth (required)
- Address

## Form Validation

- First/Last Name: 2-30 characters, letters only
- Email: Valid email format
- Required fields cannot be empty
- Date must be valid

## Database Schema

```sql
CREATE TABLE personal_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salutation VARCHAR(10),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Input validation and sanitization
- CORS enabled
- SQL injection prevention
- Error handling

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Error Handling

The application includes comprehensive error handling for:
- Form validation errors
- Database connection issues
- Server errors
- Network errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies
- Uses MySQL for robust data storage
- Implements best practices for form handling and validation
