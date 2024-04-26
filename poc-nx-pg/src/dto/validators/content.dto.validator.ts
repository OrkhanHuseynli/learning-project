import { PostCreateDto } from "../post.create.dto";
import { PostDto } from "../post.dto";
import { PostUpdateDto } from "../post.update.dto";

export function validateContentDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new PostDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${PostDto.name} failed`);
      return false;
    }
  }
  return true;
}

export function validateContentUpdateDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new PostUpdateDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${PostUpdateDto.name} failed`);
      return false;
    }
  }
  return true;
}

export function validateContentCreateDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new PostCreateDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${PostCreateDto.name} failed`);
      return false;
    }
  }
  return true;
}
