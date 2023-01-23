import { useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp(event) {
    event.preventDefault();

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password
        }
      });

      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign up</button>
    </form>
  );
}

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogIn(event) {
    event.preventDefault();

    try {
      const user = await prisma.user.findOne({
        where: {
          email
        }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }

      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleLogIn}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log in</button>
    </form>
  );
}
