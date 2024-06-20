from flask import Flask, render_template, request, redirect, url_for, session
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key

# Function to hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Mock database (for demonstration, use a real database in production)
users = {
    'alice': {'password': hash_password('password123')},
    'bob': {'password': hash_password('abc456')},
}

# Login route
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = hash_password(password)
        
        if username in users and users[username]['password'] == hashed_password:
            session['username'] = username
            return redirect(url_for('secured'))
        else:
            return render_template('login.html', message='Invalid username or password.')

    return render_template('login.html')

# Logout route
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

# Secured page route
@app.route('/secured')
def secured():
    if 'username' in session:
        return render_template('secured.html', username=session['username'])
    else:
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
