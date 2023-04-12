import { Request, Response } from 'express';
import userService from "../../services/user.service";
import Controller from "../controller";
import i18n from '../../i18n';
import customResponse from '../../utils/custom.response';
import statusCode from '../../utils/status.code';
import errorNumbers from '../../utils/error.numbers';
import validator from '../../utils/validator';
import { Errors } from 'validatorjs';
import helpers from '../../utils/helpers';
/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-22-03
 * 
 * Class UserController
 */
class UserController extends Controller {
  
  /**
   * Create a new UserController instance.
   *
   * @return void
   */
  public constructor() {
    super();
  }

  /**
   * Get user details handler
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   * 
   * @param Request req 
   * @param Response res
   * 
   * @return json of user detail 
   */
  public async profile(req: Request, res: Response) 
  {
    const userid = req.params.userId;
    if (helpers.checkObjectId(userid)) {
      userService.profile(userid)
      .then(result => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.HTTP_BAD_REQUEST,
            errNo: errorNumbers.bad_login_credentials,
            errMsg: i18n.en.profile.USER_NOT_FOUND,
          }

          return customResponse.error(response, res);
        } 
        else {
            const response = {
              status: statusCode.HTTP_OK,
              data: result,
            }
    
            return customResponse.success(response, res);
        }
      })
      .catch(error => {
        const response = {
          status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
          errNo: errorNumbers.generic_error,
          errMsg: error?.message || error,
        }

        return customResponse.error(response, res);
      })
    }
    else{
      const response = {
        status: statusCode.HTTP_BAD_REQUEST,
        errNo: errorNumbers.ivalid_resource,
        errMsg: i18n.en.update.INVALID_USER_ID,
      }

      return customResponse.error(response, res);
    }
  }
    
  /**
   * Login route handler
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   * 
   * @param Request req 
   * @param Response res 
   * 
   * @return json of Response
   */
  public async login(req: Request, res: Response) {
    
    const validationRule = {
      "email": "required|string|email",
      "password": "required|string|min:6"
    };

    await validator
    .validator(req.body, validationRule,{}, (err: Errors, status: Boolean) => {
      if (!status) {
        const response = {
          status: statusCode.HTTP_PRECONDITION_FAILED,
          errNo: errorNumbers.validator,
          errMsg: err.errors,
        }

        return customResponse.error(response, res);
      }
      else {
        userService.login(req.body)
        .then(result => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.HTTP_BAD_REQUEST,
              errNo: errorNumbers.bad_login_credentials,
              errMsg: i18n.en.login.USER_LOGIN_FAILED,
            }
    
            return customResponse.error(response, res);
          } 
          else {
              const response = {
                status: statusCode.HTTP_OK,
                data: result,
              }
      
              return customResponse.success(response, res);
          }
        })
        .catch(error => {
          const response = {
            status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
            errNo: errorNumbers.generic_error,
            errMsg: error?.message || error,
          }

          return customResponse.error(response, res);
        })
      }
    })
    .catch( error => {
      const response = {
        status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
        errNo: errorNumbers.generic_error,
        errMsg: error?.message || error,
      }

      return customResponse.error(response, res);
    })
  }

  /**
   * Logs out current logged in user session
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-11
   * 
   * @param Request req 
   * @param Response res 
   * 
   * @return json of Response
   */
  public async logout(req: Request, res: Response) {
    userService.logout(req)
    .then(result => {
      if (result === null || result === undefined) {
        const response = {
          status: statusCode.HTTP_UNAUTHORIZED,
          errNo: errorNumbers.token_not_found,
          errMsg: i18n.en.unauthorize.NO_TOKEN,
        }

        return customResponse.error(response, res);
      } 
      else {
          const response = {
            status: statusCode.HTTP_OK,
            data: result,
          }
  
          return customResponse.success(response, res);
      }
    })
    .catch(error => {
      const response = {
        status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
        errNo: errorNumbers.generic_error,
        errMsg: error?.message || error,
      }

      return customResponse.error(response, res);
    })
  }
    
  /**
   * Register route handler
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   * 
   * @param Request req 
   * @param Response res 
   * 
   * @return json of Response
   */
  public async register(req: Request, res: Response) {
    
    const validationRule = {
      "username": "required|string",
      "lastname": "required|string",
      "email": "required|string|email",
      "gender": "required|integer",
      "password": "required|string|min:6"
    };

    await validator
    .validator(req.body, validationRule,{}, (err: Errors, status: Boolean) => {
      if (!status) {
        const response = {
          status: statusCode.HTTP_PRECONDITION_FAILED,
          errNo: errorNumbers.validator,
          errMsg: err.errors,
        }

        return customResponse.error(response, res);
      }
      else {
        userService.register(req.body)
        .then(result => {
          const response = {
            status: statusCode.HTTP_CREATED,
            data: result,
          }
  
          return customResponse.success(response, res);
        })
        .catch(error => {
          const response = {
            status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
            errNo: errorNumbers.generic_error,
            errMsg: error?.message || error,
          }

          return customResponse.error(response, res);
        })
      }
    })
    .catch( error => {
      const response = {
        status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
        errNo: errorNumbers.generic_error,
        errMsg: error?.message || error,
      }

      return customResponse.error(response, res);
    })
  }
  
  /**
   * Update a user
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   * 
   * @param Request req 
   * @param Response res 
   * 
   * @return json of Response
   */
  public async update(req: Request, res: Response) {
    
    const validationRule = {
      "lastname": "required|string",
      "gender": "required|integer",
    };

    await validator
    .validator(req.body, validationRule,{}, (err: Errors, status: Boolean) => {
      if (!status) {
        const response = {
          status: statusCode.HTTP_PRECONDITION_FAILED,
          errNo: errorNumbers.validator,
          errMsg: err.errors,
        }

        return customResponse.error(response, res);
      }
      else {
        const userid = req.params.userId;
        // check if user id is valid
        if (helpers.checkObjectId(userid)) {
          userService.update(userid, req.body)
          .then(result => {
            if (result === null || result === undefined) {
              const response = {
                status: statusCode.HTTP_NOT_FOUND,
                errNo: errorNumbers.resource_not_found,
                errMsg: i18n.en.update.USER_NOT_FOUND,
              }
      
              return customResponse.error(response, res);
            } 
            else {
                const response = {
                  status: statusCode.HTTP_OK,
                  data: result,
                }
        
                return customResponse.success(response, res);
            }
          })
          .catch(error => {
            const response = {
              status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
              errNo: errorNumbers.generic_error,
              errMsg: error?.message || error,
            }

            return customResponse.error(response, res);
          })
        }
        else{
          const response = {
            status: statusCode.HTTP_BAD_REQUEST,
            errNo: errorNumbers.ivalid_resource,
            errMsg: i18n.en.update.INVALID_USER_ID,
          }
  
          return customResponse.error(response, res);
        }
      }
    })
    .catch( error => {
      const response = {
        status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
        errNo: errorNumbers.generic_error,
        errMsg: error?.message || error,
      }

      return customResponse.error(response, res);
    })
  }

  /**
   * Delete a user by id
   * 
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   * 
   * @param Request req 
   * @param Response res
   * 
   * @return json of user detail 
   */
  public async delete(req: Request, res: Response) 
  {
    const userid = req.params.userId;

    if (helpers.checkObjectId(userid)) {
      userService.delete(userid)
      .then(result => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.HTTP_BAD_REQUEST,
            errNo: errorNumbers.bad_login_credentials,
            errMsg: i18n.en.profile.USER_NOT_FOUND,
          }

          return customResponse.error(response, res);
        }
        else if(result == 'isAdmin'){
          const response = {
            status: statusCode.HTTP_BAD_REQUEST,
            errNo: errorNumbers.required_permission,
            errMsg: i18n.en.delete.CANNOT_DELETE_ADMIN,
          }

          return customResponse.error(response, res);
        }
        else {
            const response = {
              status: statusCode.HTTP_OK,
              data: result,
            }
    
            return customResponse.success(response, res);
        }
      })
      .catch(error => {
        const response = {
          status: error?.status || statusCode.HTTP_INTERNAL_SERVER_ERROR,
          errNo: errorNumbers.generic_error,
          errMsg: error?.message || error,
        }

        return customResponse.error(response, res);
      })
    }
    else{
      const response = {
        status: statusCode.HTTP_BAD_REQUEST,
        errNo: errorNumbers.ivalid_resource,
        errMsg: i18n.en.update.INVALID_USER_ID,
      }

      return customResponse.error(response, res);
    }
  }
}

const userController = new UserController();
export default userController;