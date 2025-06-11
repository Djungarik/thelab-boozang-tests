import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  constructor(private request: APIRequestContext) {
    this.request = request;
  }

  // FORM FILL
  async createFormFillItem(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    return await this.request.post("https://api.boozang.com/users/", {
      data: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
      },
    });
  }
  async deleteFormFillItem(userId: string) {
    return await this.request.delete(`https://api.boozang.com/users/${userId}`);
  }

  //CAT SHELTER
  async createCat(
    description: string,
    foundHome: boolean,
    inOrOutside: string,
    name: string
  ) {
    return await this.request.post("https://api.boozang.com/cats/", {
      data: {
        description: description,
        foundHome: foundHome,
        inOrOutside: inOrOutside,
        name: name,
      },
    });
  }
  async deleteCat(catId: string) {
    return await this.request.delete(`https://api.boozang.com/cats/${catId}`);
  }
  async updateCat(
    description: string,
    foundHome: boolean,
    catId: string,
    inOrOutside: string,
    name: string
  ) {
    return await this.request.put(`https://api.boozang.com/cats/${catId}`, {
      data: {
        description: description,
        foundHome: foundHome,
        id: catId,
        inOrOutside: inOrOutside,
        name: name,
      },
    });
  }

  //SORTED LIST
  async createSortedListItem(title: string) {
    return await this.request.post("https://api.boozang.com/todos/", {
      data: {
        title: title,
      },
    });
  }
  async deleteSortedListItem(itemId: string) {
    return await this.request.delete(`https://api.boozang.com/todos/${itemId}`);
  }
}
