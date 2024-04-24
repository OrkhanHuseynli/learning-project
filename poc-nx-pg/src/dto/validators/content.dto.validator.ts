import { ContentCreateDto } from "../content.create.dto";
import { ContentDto } from "../content.dto";
import { ContentUpdateDto } from "../content.update.dto";

export function validateContentDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new ContentDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${ContentDto.name} failed`);
      return false;
    }
  }
  return true;
}

export function validateContentUpdateDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new ContentUpdateDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${ContentUpdateDto.name} failed`);
      return false;
    }
  }
  return true;
}

export function validateContentCreateDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new ContentCreateDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${ContentCreateDto.name} failed`);
      return false;
    }
  }
  return true;
}
