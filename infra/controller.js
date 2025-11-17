import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "infra/errors";

function onNoMatchHndler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHndler,
    onError: onErrorHandler,
  },
};

export default controller;
