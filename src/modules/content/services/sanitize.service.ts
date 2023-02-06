import { Injectable } from '@nestjs/common';

import merge from 'deepmerge';
import sanitizeHtml, { IOptions } from 'sanitize-html';

@Injectable()
export class SanitizeService {
    protected config: sanitizeHtml.IOptions = {};

    constructor() {
        this.config = {
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['class', 'style', 'height', 'width'],
            },
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['code', 'img']),
            parser: {
                lowerCaseTags: true,
            },
        };
    }

    /**
     * 安全处理body
     *
     * @param body
     * @param config
     */
    public sanitize(body: string, config?: IOptions) {
        return sanitizeHtml(
            body,
            merge(this.config, config ?? {}, {
                arrayMerge: (_t, s, _o) => s,
            }),
        );
    }
}
