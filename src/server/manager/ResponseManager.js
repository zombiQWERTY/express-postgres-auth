import R from 'ramda';
import nocache from 'nocache';

class ResponseManager {
    constructor(req, res, data = {}) {
        this.req = req;
        this.res = res;
        this.data = data;
    }

    success(params = {}) {
        this.params = params;

        return this.setRes({
            success: true,
            status: this.params.status,
            data: this.params.data
        });
    }

    fail(params = {}) {
        this.params = params;

        return this.setRes({
            success: false,
            status: this.params.status,
            errors: this.params.errors,
            message: this.params.message,
            data: this.params.data
        });
    }

    get params() {
        return this._params;
    }

    set params(params) {
        const defaultParams = {
            status: 400,
            errors: [],
            data: {},
            type: '',
            message: '',
            redirectUrl: '/',
            redirectStatus: 301,
            needUser: false
        };

        params = R.merge(defaultParams, params);

        if (params.needUser) {
            params = R.assocPath(['data', 'user'], this.req.user, params);
        }

        this._params = params;
    }

    setRes(json) {
        const renderStatus = () => this.res.sendStatus(this.params.status);
        const renderRedirect = () => this.res.redirect(this.params.redirectStatus, this.params.redirectUrl);
        const renderJSON = () => {
            nocache()(this.req, this.res, R.identity);
            return this.res.status(this.params.status).send(json);
        };

        switch (this.params.type) {
            case 'status':
                return renderStatus();
            case 'redirect':
                return renderRedirect();
            default:
                return renderJSON();
        }
    }
}

export default ResponseManager;
