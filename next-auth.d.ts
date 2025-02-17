// extend the types now anything of type Session or JWT is exepected to have id field in it
declare module "next-auth" {
  interface Session {
    id: string;
  }
  interface JWT {
    id: string;
  }
}
