import { PostCreateDto, PostUpdateDto } from "../../dto";

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
    return fetch(endpoint, {
      method: "POST",
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
}
