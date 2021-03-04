import { environment } from '@env/environment';

/**
 * App context data.
 */
export class Context {
  language!: string;
  defaultLanguage!: string;
  assets!: {[key: string]: { baseUrl: string, defaultHeaders: { [key: string]: string } }}[];

  get STORAGE_LANGUAGE(): string {
    return 'language';
  }

  /**
   * Context factory.
   */
  static factory(): Promise<Context> {
    const factoryFn = (resolve: (context: Context) => void) => {
      const context = Object.assign(new Context(), environment.context);
      resolve( context );
    };

    return new Promise<Context>(factoryFn);
  }
}