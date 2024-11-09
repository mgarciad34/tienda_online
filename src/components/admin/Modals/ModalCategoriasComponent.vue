<template>
    <div class="modal-overlay"> 
        <div class="cardModal">
            <div>
               <slot></slot>
            </div>  
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cardModal {
    position: fixed;
    background: #fff;
    border-radius: 20px;
    transition: 0.5s;
    padding: 20px;
    margin-top: 4.2rem;
    display: grid;
    place-items: center; 
    height: 100vh;
    width: auto;
    height: auto;
}
</style>