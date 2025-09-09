// src/app/redirect-instagram/page.tsx
import { redirect } from 'next/navigation';

export default function RedirectInstagram() {
  // Redireciona automaticamente para o Instagram
  redirect('https://www.instagram.com/ettle.app/');
  return null; // nada será renderizado
}
