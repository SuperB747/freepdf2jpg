import fs from 'fs';
import path from 'path';

const routes = [
  '/about',
  '/pdf-to-jpg',
  '/jpg-to-pdf',
  '/contact',
  '/qa',
  '/privacy-policy',
  '/terms-of-service'
];

const template = fs.readFileSync('./dist/index.html', 'utf-8');

routes.forEach(route => {
  const dir = path.join('./dist', route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), template);
}); 