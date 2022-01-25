import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateAccount = async (email: string, id: string) => {
  try {
    const res = await prisma.account.update({
      where: {
        id: id,
      },
      data: {
        email: email,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
    },
  });

  users.forEach((e) => {
    e.accounts.forEach((a) => updateAccount(e.email!, a.id));
  });
};

main();

export {};
