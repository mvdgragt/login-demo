import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async() {
  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        firstName: "Erik",
        lastName: "Lindqvist",
        email: "erik.lindqvist@sundsgarden.se",
        code: "1111",
        role: "HEAD_WAITER",
      },
      {
        firstName: "Anna",
        lastName: "Bergström",
        email: "anna.bergstrom@sundsgarden.se",
        code: "2222",
        role: "WAITER",
      },
      {
        firstName: "Marcus",
        lastName: "Holm",
        email: "marcus.holm@sundsgarden.se",
        code: "3333",
        role: "WAITER",
      },
      {
        firstName: "Sofia",
        lastName: "Karlsson",
        email: "sofia.karlsson@sundsgarden.se",
        code: "4444",
        role: "RUNNER",
      },
      {
        firstName: "Johan",
        lastName: "Nilsson",
        email: "johan.nilsson@sundsgarden.se",
        code: "5555",
        role: "RUNNER",
      },
      {
        firstName: "Michiel",
        lastName: "van der Gragt",
        email: "michiel.vandergragt@sundsgarden.se",
        code: "1938",
        role: "ADMIN",
      },
    ],
  });
}

seed()
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
