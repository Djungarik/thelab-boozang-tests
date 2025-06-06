import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async createFormFillITem(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    //const res = await this.request.post('/api/items', { data });
    //return res.json();

    return await this.request.post("https://api.boozang.com/users/", {
      data: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
      },
    });
  }
}
