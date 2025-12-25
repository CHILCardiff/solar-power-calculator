<template>

<div class="m-3">
<h1>CHIL - Solar power calculator</h1>
<form>

    <div class="row">

        <div class="col-auto">Latitude:</div>
        <div class="col-auto">
            <input type="text" class="form-control" id="latitude" aria-describedby="latitude">
        </div>
        <div class="col-auto">Longitude:</div>
        <div class="col-auto">
            <input type="text" class="form-control" id="longitude" aria-describedby="longitude">
        </div>

    </div>

    <div class="row my-3">
    
        <div class="col-auto">Time zone:</div>
        <div class="col-auto">
            <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option value="-2">-02</option>
                <option value="-1">-01</option>
                <option selected value="0">UTC</option>
                <option value="+1">+01</option>
                <option value="+2">+02</option>
            </select>
        </div>

    </div>

</form>
</div>

</template>