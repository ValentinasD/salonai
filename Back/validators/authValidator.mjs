// Šis validatorius patikrina, ar vartotojo registracijos ir prisijungimao duomenys yra teisingi.

 export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  // Patikriname, ar visi laukai yra užpildyti
  if (!username || !email || !password) {
    return res.status(400).json({ message: '❌ Visi laukai turi būti užpildyti.' });
  }

  // Patikriname, ar el. paštas yra tinkamo formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: '❌ Neteisingas el. pašto formatas.' });
  }

  // Patikriname, ar slaptažodis yra pakankamai stiprus
  if (password.length < 6) {
    return res.status(400).json({ message: '❌ Slaptažodis turi būti bent 6 simbolių ilgio.' });
  }

  next();
};

 export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Patikriname, ar visi laukai yra užpildyti
  if (!email || !password) {
    return res.status(400).json({ message: '❌ Visi laukai turi būti užpildyti.' });
  }

  // Patikriname, ar el. paštas yra tinkamo formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: '❌ Neteisingas el. pašto formatas.' });
  }

  next();
};

