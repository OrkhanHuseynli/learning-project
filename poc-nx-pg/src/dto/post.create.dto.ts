export class PostCreateDto {
  title: string;
  content: string;
  published: boolean;

  constructor() {
    this.title = null;
    this.content = null;
    this.published = false;
  }
}
