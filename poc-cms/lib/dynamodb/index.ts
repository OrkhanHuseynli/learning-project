import type { PostEntity, DynamoPostEntity } from './post';
import dynamodb from './dynamodb-client';
import { createPost, getPosts } from './post';

export type { PostEntity, DynamoPostEntity };

export { createPost, getPosts };

export default dynamodb;