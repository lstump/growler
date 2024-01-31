import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { each } from "chart.js/dist/helpers/helpers.core";

const prisma = new PrismaClient();

async function seed() {
  const seededUsers: { email: string, username: string, password: string, id?: string}[] = [
    {
      email: "amy@fake.com",
      username: "amy",
      password: "amyiscool"
    },
    {
      email: "basil@hotmail.com",
      username: "basil",
      password: "basiliscool"
    },
    {
      email: "clara@gmail.com",
      username: "clara",
      password: "claraiscool"
    },
    {
      email: "desmond@company.com",
      username: "desmond",
      password: "desmondiscool"
    }
  ];
  for (let i = 0; i < seededUsers.length; i++) {
    const eachUser = seededUsers[i];
    const { email, username, password } = seededUsers[i];

    // cleanup the existing database
    await prisma.user.delete({ where: { email } }).catch(() => {
      // no worries if it doesn't exist yet
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const addedUser = await prisma.user.create({
      data: {
        email,
        username,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });
    eachUser.id = addedUser.id;
  };

  // from https://loremipsum.io/
  const topics = ["React", "TypeScript", "JavaScript", "GraphQL", "Prisma", "PostgreSQL", "SQLite"];
  const contents = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Rhoncus urna neque viverra justo nec ultrices dui sapien eget. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. ",
    "Adipiscing elit duis tristique sollicitudin nibh sit amet. Semper eget duis at tellus at urna condimentum mattis.",
    "Ornare massa eget egestas purus viverra. Dignissim convallis aenean et tortor at risus.",
    "Odio aenean sed adipiscing diam donec. Arcu odio ut sem nulla pharetra diam sit. Feugiat in ante metus dictum. ",
    "Odio euismod lacinia at quis. Dictum fusce ut placerat orci nulla pellentesque.",
    "Ridiculus mus mauris vitae ultricies leo integer malesuada nunc."
  ];

  for (let i = 0; i < 20; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const userId = seededUsers[Math.floor(Math.random() * seededUsers.length)].id || "";
    await prisma.post.create({
      data: {
        topic,
        content,
        userId
      }
    });
  }
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
