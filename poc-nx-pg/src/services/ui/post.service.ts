import { CurrentUserDto, PostCreateDto, PostUpdateDto } from "../../dto";
import { UserService } from "./user.service";

const endpoint = "/api/post";

export class PostService {
  async getPosts(skip: number, take: number): Promise<any> {
    return fetch(`${endpoint}?skip=${skip}&take=${take}`).then((response) =>
      response.json()
    );
  }

  async updatePost(postId: string, postUpdateDto: PostUpdateDto): Promise<any> {
    return fetch(`${endpoint}/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postUpdateDto.title,
        published: postUpdateDto.published,
        content: postUpdateDto.content,
      }),
    });
  }

  async createPost(postUpdateDto: PostCreateDto): Promise<any> {
    const currentUser: CurrentUserDto = new UserService().getCurrentUser();
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author_id: currentUser.id,
        title: postUpdateDto.title,
        published: postUpdateDto.published,
        content: postUpdateDto.content,
      }),
    });
  }
}
