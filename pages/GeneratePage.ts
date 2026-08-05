import { Locator, Page } from '@playwright/test';

export class GeneratePage {
    readonly page: Page;
    readonly generateButton: Locator;
    readonly generatedText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.generateButton = page.locator('button#generate');
        this.generatedText = page.locator('div#generated-text');
    }

    async clickGenerateButton() {
        await this.generateButton.click();
    }

    async getGeneratedText(): Promise<string | null> {
        return await this.generatedText.textContent();
    }
}