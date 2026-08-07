import { readFileSync } from 'fs';
import * as path from 'path';
import { Locator, Page } from '@playwright/test';
import process from 'process';

export class GeneratePage {
    readonly page: Page;
    readonly generateButton: Locator;
    readonly generatedText: Locator;
    readonly titleInputField: Locator;
    readonly subtitleInputField: Locator;
    readonly currentWorkProjectInputField: Locator;
    readonly currentWorkProjectLinkInputField: Locator;
    readonly collaborationInputField: Locator;
    readonly collaborationLinkInputField: Locator;


    constructor(page: Page) {
        this.page = page;
        this.generateButton = page.locator('button#generate');
        this.generatedText = page.locator('div#generated-text');
        this.titleInputField = page.locator('#title-name');
        this.subtitleInputField = page.locator('#subtitle');
        this.currentWorkProjectInputField = page.locator('#currentWork');
        this.currentWorkProjectLinkInputField = page.locator('#currentWork-link');
        this.collaborationInputField = page.locator('#collaborateOn');
        this.collaborationLinkInputField = page.locator('#collaborateOn-link');
    }

    async goTo(url: string) {
        await this.page.goto(url);
    }

    selectRandomSkills(): string {
        const dataPath = path.resolve(process.cwd(), 'data/sample-user-data.json');
        const rawData = readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(rawData) as { skillTitles?: string[] };
        const skillTitles = parsedData.skillTitles ?? [];

        if (skillTitles.length === 0) {
            throw new Error('No skill titles found in the provided sample data');
        }

        const randomIndex = Math.floor(Math.random() * skillTitles.length);
        return skillTitles[randomIndex];
    }

    getSkillCheckboxesInSection(sectionTitle: string): Locator {
        const section = this.page.locator('div.divide-y.divide-gray-500').filter({ hasText: sectionTitle });
        return section.locator('input[type="checkbox"]');
    }

    async selectRandomCheckboxes(sectionTitle: string, count: number = 2): Promise<string[]> {
        const checkboxes = this.getSkillCheckboxesInSection(sectionTitle);
        const total = await checkboxes.count();

        if (total === 0) {
            throw new Error(`No checkboxes found for section: ${sectionTitle}`);
        }

        const amount = Math.min(count, total);
        const selectedIndexes = new Set<number>();

        while (selectedIndexes.size < amount) {
            selectedIndexes.add(Math.floor(Math.random() * total));
        }

        const selectedIds: string[] = [];

        for (const index of selectedIndexes) {
            const checkbox = checkboxes.nth(index);
            const id = await checkbox.getAttribute('id');

            if (!id) {
                continue;
            }

            await this.page.locator(`label[for="${id}"]`).click();
            selectedIds.push(id);
        }

        return selectedIds;
    }

    async fillSocial(platform: string, value: string) {
        await this.page.locator(`#${platform}`).fill(value);
    }

    async clickGenerateButton() {
        await this.generateButton.click();
    }

    async getGeneratedText(): Promise<string | null> {
        return await this.generatedText.textContent();
    }

}