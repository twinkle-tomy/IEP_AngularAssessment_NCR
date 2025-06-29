import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authentifyGuard: CanActivateFn = (route, state) => 
{
  const _router = inject(Router);
  let isLoggedIn = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  if (isLoggedIn)
  {
    return true;
  }
  else
  {
    alert("Please login !!!");
    _router.navigate(['login']);
    return false;
  }
};
