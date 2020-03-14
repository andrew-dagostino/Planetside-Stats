$(document).ready(() => {
    // Redirect to player stats page
    $("#homepageSearchForm").on("submit", () => {
        window.location.replace("/player/" + $("#homepageSearchInput").val());
        return false;
    });
});