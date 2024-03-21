export enum SerializationStyle {
  SIMPLE = 'simple',
  LABEL = 'label',
  MATRIX = 'matrix',
  FORM = 'form',
  SPACE_DELIMITED = 'space_delimited',
  PIPE_DELIMITED = 'pipe_delimited',
  DEEP_OBJECT = 'deep_object',
}

export function serializePath(
  pathPattern: string,
  pathArguments: Record<string, unknown>,
  style = SerializationStyle.SIMPLE,
  explode = false,
): string {
  return Object.entries(pathArguments).reduce((acc, [key, value]) => {
    const replaceValue = getPathReplaceValue(value, key, style, explode);
    return acc.replace(`{${key}}`, `${replaceValue}`);
  }, pathPattern);
}

export function serializeQuery(
  queryParams?: Record<string, unknown>,
  _style = SerializationStyle.FORM,
  explode = false,
): string {
  if (!queryParams) {
    return '';
  }

  // only style = form is supported for now
  const query = Object.entries(queryParams)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (explode) {
          return value.map((v) => `${key}=${encode(v)}`).join('&');
        } else {
          return `${key}=${value.map(encode).join(',')}`;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (explode) {
          return Object.entries(value)
            .map(([k, v]) => `${k}=${encode(v)}`)
            .join('&');
        } else {
          return `${key}=${Object.entries(value)
            .map(([k, v]) => `${k},${encode(v)}`)
            .join(',')}`;
        }
      } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        return `${key}=${encode(value)}`;
      }
      return '';
    })
    .join('&');

  return `?${query}`;
}

function getPathReplaceValue<T>(value: T, key: string, style: SerializationStyle, explode: boolean): string {
  if (Array.isArray(value)) {
    return serializePathArray(value, key, style, explode);
  }

  if (typeof value === 'object' && value !== null) {
    return serializePathObject(value, key, style, explode);
  }

  if (style === SerializationStyle.LABEL) {
    return `.${encode(`${value}`)}`;
  }

  if (style === SerializationStyle.MATRIX) {
    return `;${encode(`${value}`)}`;
  }

  return encode(`${value}`);
}

function getPathPrefix(style: SerializationStyle, explode: boolean, key: string): string {
  if (style === SerializationStyle.LABEL) {
    return '.';
  }
  if (style === SerializationStyle.MATRIX) {
    return explode ? `;` : `;${key}=`;
  }
  return '';
}

function serializePathObject<T extends object>(
  value: T,
  key: string,
  style: SerializationStyle,
  explode: boolean,
): string {
  const delimiter = getPathDelimiter(style, explode);
  const serialized = Object.entries(value)
    .map(([k, v]) => {
      const joinCharacter = explode ? '=' : delimiter;
      const sanitized = encode(v);
      return `${k}${joinCharacter}${sanitized}`;
    })
    .join(delimiter);

  const prefix = getPathPrefix(style, explode, key);

  return `${prefix}${serialized}`;
}

function serializePathArray(
  array: (string | number | boolean)[],
  key: string,
  style: SerializationStyle,
  explode: boolean,
): string {
  const sanitized = array.map(encode);
  if (style === SerializationStyle.LABEL) {
    return `.${sanitized.join(explode ? '.' : ',')}`;
  }
  if (style === SerializationStyle.MATRIX) {
    if (explode) {
      return `;${sanitized.map((sanitizedValue) => `${key}=${sanitizedValue}`).join(';')}`;
    }
    return `;${key}=${sanitized.join(',')}`;
  }

  return sanitized.join(',');
}

function encode(value: string | number | boolean): string {
  return encodeURIComponent(value);
}

function getPathDelimiter(style: SerializationStyle, explode: boolean): string {
  if (!explode || style === SerializationStyle.SIMPLE) {
    return ',';
  }
  if (style === SerializationStyle.LABEL) {
    return '.';
  }
  if (style === SerializationStyle.MATRIX) {
    return ';';
  }
  return ',';
}
