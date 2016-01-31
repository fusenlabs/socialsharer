import 'whatwg-fetch';

let Share = (container, options) => {

  let conf = Object.assign({
    url: '',
    networks: ['tw', 'fb', 'in'],
    showCounter: true,
    title: '',
    summary: '',
    hastags: '',
  }, options);

  /*
   * normalize
   */
  let normalize = (network, response) => {
    let formats = {
      fb: response.data ? response.data[0].total_count : 0,
      tw: response.count,
      in: response.count
    };
    return formats[network];
  }

  /*
   * getCount
   */
  let getCount = (network) => {
    let socialUrls = {
      fb: `https://graph.facebook.com/fql?q=SELECT%20like_count,%20total_count,%20share_count,%20click_count,%20comment_count%20FROM%20link_stat%20WHERE%20url%20=%20%22${conf.url}%22`,
      tw: `http://opensharecount.com/count.json?url=${conf.url}`,
      in: `https://www.linkedin.com/countserv/count/share?url=${conf.url}&format=json`
    };
    return fetch(socialUrls[network])
      .then((response) => {
        return response.json()
      }).then(response => {
        return normalize(network, response);
      });
  };

  /*
   * getCount
   */
  let shareUrl = (network) => {
    let socialUrls = {
      fb: `http://facebook.com/sharer.php?s=100&p[url]=${conf.url}`,
      tw: `https://twitter.com/intent/tweet?text=${conf.title}&url=${conf.url}`,
      in: `https://www.linkedin.com/shareArticle?mini=true&url=${conf.url}&title=${conf.title}&summary=${conf.summary}&source=`
    };

    return open(
      socialUrls[network],
      'Share',
      'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0'
    );
  };

  /*
   * Update template count
   */
  let updateCount = (count, element) => {
    count.then(response => {
      element.querySelector('.share-count').innerHTML = response;
    })
  };

  /*
   * Template maker
   */
  let template = (showCounter) => {
    let counter = `<span class="share-count">0</span>`;
    return showCounter ? `${counter} <i></i>` : `<i></i>`;
  };

  /*
   * clickHandler
   */
  let clickHandler = (event) => {
    let target = event.target || event.srcElement
    if (event.path[0].classList.contains('socier')) {
      shareUrl(event.path[0].dataset.network);
    } else if (event.path[1].classList.contains('socier')) {
      shareUrl(event.path[1].dataset.network);
    }
  };
  
  /*
   * render
   */
  let render = (container, networks, showCounter) => {
    networks.map(network => {
      let child = document.createElement("DIV");
      child.className = `socier icon-${network}`;
      child.setAttribute('data-network', network);
      child.innerHTML = template(showCounter);
      child.addEventListener('click', clickHandler, false);
      container.appendChild(child);

      if (showCounter) updateCount(getCount(network), child);
    });
  };

  render(
    container,
    conf.networks,
    conf.showCounter
  );
};

export default Share;