import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { GameArticle, SectionType, GameArticleSection } from '../model/game-article';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-article-edit',
  templateUrl: './game-article-edit.component.html',
  styleUrls: ['./game-article-edit.component.scss']
})
export class GameArticleEditComponent implements OnInit {
  article: GameArticle = new GameArticle();
  articleForm: FormGroup;
  types = [
    { text: 'Markdown', value: SectionType.MARKDOWN },
    { text: 'YouTube', value: SectionType.YOUTUBE }
  ];
  typeEnums = {
    markdown: SectionType.MARKDOWN,
    youtube: SectionType.YOUTUBE
  };
  categories = [];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.articleForm = this.formBuilder.group({
      title: [''],
      abbreviation: [''],
      category: [],
      content: this.formBuilder.array([ this.createSection() ])
    });
    this.categories = this.route.snapshot.data.categories.data;
  }

  createSection(): FormGroup {
    return this.formBuilder.group({
      type: [SectionType.MARKDOWN],
      markdown: [''],
      youtubeId: ['']
    });
  }

  addSection() {
    const content = this.articleForm.get('content') as FormArray;
    content.push(this.createSection());
  }

  deleteSection(index: number) {
    const content = this.articleForm.get('content') as FormArray;
    // Only remove if there are multiple sections in the form array
    if (content.length > 1) {
      content.removeAt(index);
    }
  }
}
