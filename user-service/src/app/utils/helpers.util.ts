/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-04-10
 *
 * Class Helpers
 */
class Helpers {
  /**
   * Check ObjectId validity
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   *
   * @param {string} id the object id
   * @returns {RegExpMatchArray | nul} true | false
   */
  public checkObjectId(id: string): RegExpMatchArray | null {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
}

const helpers = new Helpers();
export default helpers;