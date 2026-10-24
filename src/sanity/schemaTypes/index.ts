import { catalogueTypes } from './catalogue';
import { editorialTypes } from './editorial';
import { objectTypes } from './objects';
import { pageTypes } from './pages';

export { SINGLETON_TYPES } from './pages';

export const schemaTypes = [...objectTypes, ...pageTypes, ...catalogueTypes, ...editorialTypes];
