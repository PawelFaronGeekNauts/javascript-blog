'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTags: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post .post-author',
  optTagsListSelector = '.list.tags',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorListSelector = '.list.authors';

function titleClickHandler(event){

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles .active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  event.preventDefault();
  const clickedElement = this;

  clickedElement.classList.add('active');

  /* [DONE]remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE}get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE]find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE]add class 'active' to the correct article */

  targetArticle.classList.add('active');

}

function generateTitleLinks(customSelector = ''){
  /* [DONE]remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector).innerHTML = '';


  /* [DONE]for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles) {
    /* [DONE]get the article id */

    const articleId = article.getAttribute('id');

    /* [DONE]find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;


    /* [DONE]get the title from the title element */

    const titleList = document.querySelector(optTitleListSelector);

    /* [DONE]create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);


    /* [DONE]insert link into titleList */

    html = html + linkHTML;

    titleList.innerHTML = html;
  }

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags){

  const params = {
    max: 0,
    min: 999999
  };
  for(let tag in tags){
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }else if(tags[tag] < params.min) {
      params.min = tags[tag];
    }

  }

  return params
}

calculateTagsParams();

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);

  return classNumber
}



function generateTags(){

  let allTags = {};

  /*[DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /*[DONE] START LOOP: for every article: */
  for(let article of articles) {

    /*[DONE] find tags wrapper */

      const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /*[DONE]make html variable with empty string */

      let html = '';

    /*[DONE] get tags from data-tags attribute */

      const articleTags = article.getAttribute('data-tags');

    /* [DONE]split tags into array */

      const articleTagsArray = articleTags.split(' ');
    /* [DONE]START LOOP: for each tag */

      for (let tag of articleTagsArray){
      /* [DONE]generate HTML of the link */

        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.articleTags(linkHTMLData);


      /*[DONE] add generated code to html variable */

        html = html + linkHTML;

        if(!allTags.hasOwnProperty(tag)){
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

    /*[DONE] END LOOP: for each tag */
      }

    /* [DONE]insert HTML of all the links into the tags wrapper */

      tagsWrapper.innerHTML = html;

  /*[DONE] END LOOP: for every article: */
  }

  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);

  let allTagsData = {tags: []};

  for(let tag in allTags) {

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for(let activeTag of activeLinks){

    /* remove class active */

    activeTag.classList.remove('.active');
    console.log(activeTag);
    console.log(activeLinks);

  /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('.active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.post-tags .list a, .list.tags a');

  /* START LOOP: for each link */
  for(let tagLink of tagLinks){

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

/*Generowanie autorów*/

function generateAuthors(){
  /* find all arthicles */
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  /* Start loop for every article */

  for(let article of articles){
    /*find authors wrapper*/

      const authorWrapper = article.querySelector(optArticleAuthorSelector);

      /*create empty html variable*/

      let html = '';

      /*find author for every article */

      const articleAuthor = article.getAttribute('data-author');

      /*generate html link for author*/

      const authorHTMLData = {id: articleAuthor, title: articleAuthor,};
      const authorHTML = templates.articleAuthor(authorHTMLData);

      /*add generated code to html variable */

      html = html + authorHTML;

      if(!allAuthors.hasOwnProperty(articleAuthor)){
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

     /*insert html code to wraper */

      authorWrapper.innerHTML = html;

    /*END loop for every article */
  }

  let allAuthorData = {authors: []};

  const authorListHTML = document.querySelector(optAuthorListSelector);

  for(let articleAuthor in allAuthors){


    allAuthorData.authors.push({
      authors: articleAuthor,
      count: allAuthors[articleAuthor]
    })
  }

  authorListHTML.innerHTML = templates.authorCloudLink(allAuthorData);
  console.log(allAuthorData);

}


generateAuthors();

function authorClickHandler(event){

  /*prevent default action for this event*/
  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  for(activeAuthor of activeAuthors){

    activeAuthor.classList.remove('active');

  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for(let authorLink of authorLinks){
    authorLink.classList.add('.active');
  }

  generateTitleLinks('[data-author="' + author +'"]');

}

function addClickListnerToAuthors(){
  /*find all links to author*/
  const authorLinks = document.querySelectorAll('.post-author a, .list.authors a')
  /* START loop for every author link */
  for(let authorLink of authorLinks) {
    /*add author event listner for author link*/
    authorLink.addEventListener('click', authorClickHandler);
  /*STOP loop for every author link */
  }
}

addClickListnerToAuthors();

