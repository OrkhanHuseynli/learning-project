export class PostDto {
  id: number;
  author_id: number;
  title: string;
  content: string;
  published: boolean;

  constructor() {
    this.id = null;
    this.author_id = null;
    this.title = null;
    this.content = null;
    this.published = false;
  }
}
