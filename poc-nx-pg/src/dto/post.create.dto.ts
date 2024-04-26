export class PostCreateDto {
  author_id: number;
  title: string;
  content: string;
  published: boolean;

  constructor() {
    this.author_id = null;
    this.title = null;
    this.content = null;
    this.published = false;
  }
}
