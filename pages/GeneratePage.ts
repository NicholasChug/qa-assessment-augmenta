import { Locator, Page, expect } from '@playwright/test';
import { SocialPlatform } from '../helpers/Social';
import { Skill } from '../helpers/Skills';

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
    readonly topSkillsCheckbox: Locator;
    readonly topSkillsEditButton: Locator;
    readonly topSkillsTitleColourButton: Locator;
    readonly generateREADMEButton: Locator;
    readonly markdownBox: Locator;
    readonly hostedStarCount: Locator;
    readonly webpageStarCount: Locator;
    readonly uploadJSONButton: Locator;


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
        this.topSkillsCheckbox = page.locator('#top-languages');
        this.topSkillsEditButton = page.locator('#top-languages-open-btn');
        this.topSkillsTitleColourButton = page.locator('#top-lang-title-color');
        this.generateREADMEButton = page.getByRole('button', { name: 'Generate README' });
        this.markdownBox = page.locator('#markdown-box');
        this.hostedStarCount = page.locator('span.github-count');
        // this.webpageStarCount = page.locator('a[href*="/rahuldkjain/github-profile-readme-generator"], button:has-text("Star")').filter({ hasText: 'Star' }).locator('span').filter({ hasText: /\d/ }).first();
        this.uploadJSONButton = page.getByRole('button', { name: 'Upload json file' });
    }

    async goTo(url: string) {
        await this.page.goto(url);
    }

    async selectSkill(skill: Skill) {
        await this.page.locator(`#${skill}`).check({ force: true });
    }

    async selectSkills(skills: Skill[]) {
        for (const skill of skills) {
            await this.selectSkill(skill);
        }
    }

    async fillSocials(platforms: Array<{ platform: SocialPlatform; value: string }>) {
        for (const { platform, value } of platforms) {
            await this.page.locator(`#${platform}`).fill(value);
        }
    }

    async changeColour(colour: string, targetField: Locator) {
        await targetField.fill(colour);
    }

    async retrieveGithubAPIStarCount(url: string): Promise<number> {
        const response = await this.page.request.get(url);
        const data = await response.json();
        const starCount = data.stargazers_count;
        return starCount;
    }

    // async retrieveGithubWebpageStarCount(url: string) {
    //     await this.goTo(url);

    //     const visibleText = await this.page.locator('body').innerText();
    //     const starMatch = visibleText.match(/Star\s+([0-9,.]+k?)/i);

    //     if (!starMatch) {
    //         throw new Error('Unable to locate the GitHub star count on the repository page');
    //     }

    //     const starCountText = starMatch[1].replace(/,/g, '');
    //     const starCount = parseFloat(starCountText?.replace('k', '')) * (starCountText.includes('k') ? 1 : 1);
    //     console.log(`GitHub Star count from webpage: ${starCount}`);
    //     return starCount;
    // }

    async compareStarCount(hostedCount: number, githubCount: number): Promise<boolean> {
        return hostedCount === githubCount;
    }

    async uploadJSONFile(filePath: string) {
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);
    }

}