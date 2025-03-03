export default abstract class BaseRequestClient {
   protected baseUrl: string;

   constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
   }
}
