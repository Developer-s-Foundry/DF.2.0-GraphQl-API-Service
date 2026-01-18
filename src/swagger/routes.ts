/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BaseController } from './../controller/metric_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogController } from './../controller/metric_controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Metric": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "update_at": {"dataType":"datetime","required":true},
            "metric_name": {"dataType":"string","required":true},
            "time_stamp": {"dataType":"datetime","required":true},
            "metric": {"dataType":"any","required":true},
            "value": {"dataType":"double","required":true},
            "project_id": {"dataType":"double","required":true},
            "project": {"ref":"Project","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Project": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "base_url": {"dataType":"string","required":true},
            "prometheus_metric_url": {"dataType":"string","required":true},
            "team_id": {"dataType":"double","required":true},
            "owner_id": {"dataType":"double","required":true},
            "updated_at": {"dataType":"datetime","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "metrics": {"dataType":"array","array":{"dataType":"refObject","ref":"Metric"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "timeDifference": {
        "dataType": "refEnum",
        "enums": ["1-hour-ago","2-hours-ago","1-day-ago","1-month-ago","1-year-ago"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsBaseController_getBase: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/',
            ...(fetchMiddlewares<RequestHandler>(BaseController)),
            ...(fetchMiddlewares<RequestHandler>(BaseController.prototype.getBase)),

            async function BaseController_getBase(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBaseController_getBase, request, response });

                const controller = new BaseController();

              await templateService.apiHandler({
                methodName: 'getBase',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogController_getMetrics: Record<string, TsoaRoute.ParameterSchema> = {
                project_id: {"in":"path","name":"project_id","required":true,"dataType":"string"},
                time_difference: {"in":"query","name":"time_difference","ref":"timeDifference"},
                page: {"in":"query","name":"page","dataType":"double"},
                metric_name: {"in":"query","name":"metric_name","dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/metrics/search-metrics/:project_id',
            ...(fetchMiddlewares<RequestHandler>(LogController)),
            ...(fetchMiddlewares<RequestHandler>(LogController.prototype.getMetrics)),

            async function LogController_getMetrics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogController_getMetrics, request, response });

                const controller = new LogController();

              await templateService.apiHandler({
                methodName: 'getMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
