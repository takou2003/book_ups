document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.setting');
    const search = document.getElementById('other');
    
    hamburger.addEventListener('click', function() {
        search.classList.toggle('active');
    });
    
    // Fermer la search bar en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!search.contains(event.target) && !hamburger.contains(event.target)) {
            search.classList.remove('active');
        }
    });
});

var navigates = document.querySelectorAll(".sp");
var sections = document.getElementsByClassName("menu");
//console.log(navigate[0].id);
navigates.forEach((navigate,index) => {
	navigate.addEventListener('click', function(){
		for(var i=0; i<navigates.length; i++){
			navigates[i].classList.remove('active');
			sections[i].classList.remove('active');	
		}
		document.getElementById(navigate.id).classList.add('active');
		document.getElementById(sections[index].id).classList.add('active');
	});
});
var sm_s = document.querySelectorAll(".sm_");
var section_as = document.getElementsByClassName("section_a");
//console.log(navigate[0].id);
sm_s.forEach((sm_,index) => {
	sm_.addEventListener('click', function(){
		for(var i=0; i<sm_s.length; i++){
			sm_s[i].classList.remove('active');
			section_as[i].classList.remove('active');
		}
		document.getElementById(sm_.id).classList.add('active');
		document.getElementById(section_as[index].id).classList.add('active');
	});
});
