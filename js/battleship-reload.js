function get_bbspeed(weapon_cooldown, reload_stat, reload_percent_buff){
	return Math.sqrt(1.0 + reload_stat / 100.0 * (1 + reload_percent_buff / 100.0)) * Math.SQRT1_2 / weapon_cooldown; 
}

function get_bbcooldown(weapon_cooldown, reload_stat, reload_percent_buff, has_timed_reload_buff, timed_reload_percent_buff, timed_reload_buff_duration, cooldown_reduction_percent, has_boomer_fcr){
	let cooldown;
	if (!has_timed_reload_buff || timed_reload_buff_duration <= 0 || timed_reload_percent_buff <= 0){
		cooldown = 1.0 / get_bbspeed(weapon_cooldown, reload_stat, reload_percent_buff);
	} else {
		let speed_with_timed_buff = get_bbspeed(weapon_cooldown, reload_stat, reload_percent_buff + timed_reload_percent_buff);
		let completion_with_buff = speed_with_timed_buff * timed_reload_buff_duration; 
		if (completion_with_buff >= 1.0){
			cooldown = 1.0 / speed_with_timed_buff;
		} else {
			let speed_without_timed_buff = get_bbspeed(weapon_cooldown, reload_stat, reload_percent_buff);
			cooldown = (1.0 - completion_with_buff) / speed_without_timed_buff + timed_reload_buff_duration;
		}
	}
	let cd_reduction = +cooldown_reduction_percent;
	if (has_boomer_fcr){
		cd_reduction += 15.0;
	}
	cooldown = cooldown * (1.0 - cd_reduction / 100.0);
	if (cooldown > 0.0 && cooldown < 300.0){
		return Math.round(cooldown * 100.0) / 100.0;
	} else {
		return -1.0;
	}
}

function update_guntextfields() {
	if ($('#cdred2enablecb').is(':checked')){
		$('#cdredshowhide1').css('display', 'table-row');
		$('#cdredshowhide2').css('display', 'table-row');
	} else {
		$('#cdredshowhide1').css('display', 'none');
		$('#cdredshowhide2').css('display', 'none');
	}
	$('#maingun1cdtextfield').prop('value', $('#maingun1cddropdown').prop('value'));
}

function calculate_bbcooldown() {
	let reloadstat = $("#bbreloadstattextfield").prop('value');
	let reloadbuff = $("#bbreloadbufftextfield").prop('value');
	let weaponcd = $("#maingun1cdtextfield").prop('value');
	let cooldown_reduction = $("#cdreduction1textfield").prop("value");
	let has_timed_reload_buff = $('#cdred2enablecb').is(':checked');
	let has_boomer_fcr = $("#boomerfcrbox").is(":checked");
	let timed_reload_percent_buff = $('#cdred2percenttxtfield').prop('value');
	let timed_reload_buff_duration = $('#cdred2timetxtfield').prop('value');
	let cooldown = get_bbcooldown(+weaponcd, +reloadstat, +reloadbuff, has_timed_reload_buff, +timed_reload_percent_buff, +timed_reload_buff_duration, +cooldown_reduction, has_boomer_fcr);
	if (cooldown > 0.0){
		$("#finalbbcooldown").prop("innerHTML", cooldown + "s");
	} else {
		$("#finalbbcooldown").prop("innerHTML", "Some Error Occurred :(");
	}
}

// Load This After JQuery
$(function(){
	update_guntextfields();
	calculate_bbcooldown();
});
