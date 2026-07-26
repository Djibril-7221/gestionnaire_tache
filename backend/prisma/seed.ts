import { PrismaClient, Role } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const motDePasseHash = await bcrypt.hash('MotDePasse123!', 10);


  await prisma.utilisateur.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      nom: 'Ndiaye',
      prenom: 'Fatou',
      email: 'admin@demo.com',
      mot_de_passe: motDePasseHash,
      role: Role.ADMINISTRATEUR,
    },
  });


  const managers = [
    { nom: 'Sow', prenom: 'Moussa', email: 'manager1@demo.com' },
    { nom: 'Fall', prenom: 'Aissatou', email: 'manager2@demo.com' },
  ];
  for (const m of managers) {
    await prisma.utilisateur.upsert({
      where: { email: m.email },
      update: {},
      create: { ...m, mot_de_passe: motDePasseHash, role: Role.MANAGER },
    });
  }


  const collaborateurs = [
    { nom: 'Diop', prenom: 'Awa', email: 'collab1@demo.com' },
    { nom: 'Ba', prenom: 'Cheikh', email: 'collab2@demo.com' },
    { nom: 'Sarr', prenom: 'Mariama', email: 'collab3@demo.com' },
    { nom: 'Diallo', prenom: 'Ibrahima', email: 'collab4@demo.com' },
    { nom: 'Gueye', prenom: 'Khady', email: 'collab5@demo.com' },
  ];
  for (const c of collaborateurs) {
    await prisma.utilisateur.upsert({
      where: { email: c.email },
      update: {},
      create: { ...c, mot_de_passe: motDePasseHash, role: Role.COLLABORATEUR },
    });
  }

  console.log('Seed terminé : 1 admin, 2 managers, 5 collaborateurs créés.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });