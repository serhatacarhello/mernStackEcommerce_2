// validations.js

function validateInput(name, email, password) {
    // Name
    if(!name) {
      throw createError('Name is required', 400)
    }
  
    // Email 
    if(!isValidEmail(email)) {
      throw createError('Invalid email', 400)
    }
  
    // Password
    if(password.length < 6) {
      throw createError('Password must be min 6 chars', 400) 
    }
  } 
  
  function isValidEmail(email) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return re.test(email); 
  }