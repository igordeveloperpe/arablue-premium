
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Polo Signature Arablue',
    category: 'Camisas',
    price: 89.0,
    color: 'Azul Oceano Profundo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2caUyK0j1sbM-Olbfh-f8u61he6dFsFTlK8IjyJwqkMTTpT9ya99UhCbsqkaXahNmEswY3ynWl8QvjlmLjWJ1aXZBkWhx1wlHQgygj1ISe793K9VB0ENW0GRqJ2ZdSs6Wow7qOcXKgVogCYberUKdhUNsTxIltquCsduBWkwQe2kzg1LAawr-il7fdBdK9Vljrn8JRKUvzF4QsdEFzbskO3loCmyOIKFZV1RtH7RnE5RxAlPq4iT_l5iagUbZqqfTAqKYCdA3H6s',
    isNew: true,
  },
  {
    id: '2',
    name: 'Camisa Oxford Clássica',
    category: 'Camisas',
    price: 120.0,
    color: 'Branco Absoluto',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTIIrVznxBm568AQA9D6f08JZZML8yJJSQaPtxIR3f43hFKRJIT4xD8dEd6thGkwL4pkCLatIEDJ1nTs0R5uScr_-aGoBiSwf1OCpRAS25JjW5DqmeyYNeAnKYLVFzSwnMtICiXWJX0Jk8S851sy85f1AiFo57H8kS9l1m6YfWcKmaLvs32eSgrRHyK4pLP2rviiai3Tw2kDTnDw4XR_bdlRb7BARzJi8m-XxwOR5f0WD3YL0LzJDUyJOlpYwVEntvUlf1B7Kvksw',
  },
  {
    id: '3',
    name: 'Chinos Slim-Fit',
    category: 'Calças',
    price: 145.0,
    color: 'Areia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChfByfsMPyZZIxxszRPvaRZM8Migc9IgA4R2WxULL-9vIHtXwSfGyF6pUK0I6oGTY0mZmFGFaSjRPEZ3TqI98iCS5tqzc2DlGhY_uYQdhtagy7T-uuM4bVCAbAOoGkVbmB1udpIzYIwG1IruMGMU3h_kgJeyPJqy0I8LsNqWtucM77gLt5hud8WeX9KT_rU8tBswCZ2hzsh7eaVA7u0bUI1k-ufygRaFETvJO_YhZMepZ_Gmz8_dmAjSVyimVGI96SfyAVoR7BVEM',
  },
  {
    id: '4',
    name: 'Bomber Técnica',
    category: 'Blazers',
    price: 210.0,
    color: 'Azul Marinho',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA46wMwEwwDJQQOUqNU8E9lNawDnn-6S8YLHKHa0SY4TDL-uw1Q2PuFf7jeRyxdMTFBKGFGgDMxufEk4CQSNJVweMrxFQ-xzHmrAwfJvj4QoCt7fQgMhA6mQZL0zLcRA8SAnp5Yvcb5zzrBKqd6fZpxTlaDwCkDaPq7mAR534VxB_EGmoTqb1iniBxs5dImjfjkbD6xo3EY5cvdSI-PPuuc0JJvmptEQuToke5kUf3D0TBN3HNEF_dD7bj4KH7EuGp6TqRHJ565vuo',
  },
  {
    id: '5',
    name: 'Suéter de Cashmere V',
    category: 'Tricot',
    price: 210.0,
    color: 'Cinza Mescla',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCefKdNLSFy9afFLlmEHn81J1Gj-kIVWQIGGWuXAKK8NCAkPAa310Rz53wwGtqO3zxy4xZISgyrfTIFxbME4eIiJwJnp8oaB52QYTTeXdJHB8nBiFeE7qQkZfJ2YA6_NjpI_HicPGJUSDpi-egNLxj35PCu6462r6mywhk-n-nFLQlLs3HWYTLg_QjHFXYdRwnyiSaFOfURhv2UhjZ-g25j-WzuOegM3m0hDIwT8i1joSY-Q2EES70_a6VM_bbqiwhM8fL6q9zu7Wg',
  },
  {
    id: '6',
    name: 'Conjunto Resort Linho',
    category: 'Conjuntos',
    price: 180.0,
    oldPrice: 225.0,
    color: 'Verde Oliva',
    onSale: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvvrYKKTl37XfFGjJOwdteoZSnmZnu34yaRkygJxHCAFQgQEq2ol-aKaCS0WhBSYqcBj9xKMmnpUkAqNwYSdvL3CL8-nN_p4nqQ5aHk_cYOMxjMhMLkvJjxpgUkYICbIID2Qzmp7dh-pIZk5sucB9HRJN4Co1iu5EfYddfzLHzcqprLdG4R7jzYM3DvlGYUnM_Ad1wwkHjkyL9gNoeCDu156r4RyMcjlTwXGl89sTUJnwE5JrkgfQeJCbZsy27JW2Zb5R6V3IcR4',
  }
];

export const IMAGES = {
  HERO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAovguGu8wE9k7RYcsjpy0YR0rX9CSmVfjb7d534YdISa0KF3GY-MbsVW6GJgJggN76U2K_2zBL-M7SDB1TTv_wgjw3RVxeRaIMrjcLW7Z0gWegDav2zC0iSCqmLQ8sC92KzH01xydnnbHw1hlsamSiWyRkifsrKUIVI5KVmknkAN-UxWURfgSeQM1YJbQoHxivhdZp5Lb3BqI6wD1mLPiscMy_G6b-G5Ju63SDDSP07tERZpSClSKe0CmdRiT6Vc3I_wnyDEMjPPA',
  URBAN: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN_Zv5i5EVcE2dE49ELcevu6wBPAuOSv0Z1WU_F7rj8wQCiP9yqf8iX5FrWySrDbebpEVQ-7eoONurbazizu5qov8dAzHfmnv1VbY-qiHDcNdmjPhPbJK5IkkUq9-GhvJehhCZjl3kSFwBisDsjKfbKOMKsLDYOAjQm7mPDnIhWQ05AWePGP92239JPFv-lw9pq5icXrqxQCNQQ4R2PwwStsYy9ycEwR-_O1FcZJoOx0-upE6dXv44xw-l_EDRm70r6hZJRAY5i3E',
  ESSENTIAL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5yyA6gJOvfuPbynnJDsd2CD8ZH7gKbqRzMge-V5lcsdxeGlp5bqvQ_efmLDkoU5SzoM3vMw0vnYeN1HXPxxKI_cb46RR-cNUQFilNYO8fAlmkAau3aATxaNN-3tJ7-83TBWPwkY1c2_Skp6ygDOGXMww7DtMaUN-7q2Q5Q6CmHB0stO0fyFWtMZJyo3U3BpwN5kCZ5dZgHcGaQkJegggV5H6ofkUm5aKfYZdjKXfGwv2GixQwjJUq_FQiY7omOXslHSIP-viL-vQ',
  PREMIUM: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJYBAtRShB3BoghacQEr1V7btnuUH7YuEjLl0dAV_7wnG6r4vuzO2tKFWUuZt_DIIHgZtyVTZSLiLpJfoZn3OrGgJK1EaUJqiIhFnh6COULlvbtfOqx_QUN9HoqgD-1X0drCssKkrINfRdxX8wvAdTVKSq2vxFeQrfUL6IhCjgw7tMmoCZKTrm7fdhRcZdUMoxzKXCKwgJvigoSU0WN4gYM-b7KD0MB8bssZJEPPvjoO_YBlLYW67G4hDBbQYgKlWqCx8mbhZqgOU',
  ABOUT_HERO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZEsKMatYBiskY_UgEJR_RnqZ4AeVgsKNFB1B9R5cCV59IDjBV0h0tQqK_QNOXjEK4_WFnjmSlYi5EE880UpuS2n5_3-kA4owQLq-UgJJGBoaP0iJChS4vrzcvRgyZ-q76RUfnBgjUTbz2sz1WPwHI30q8kbatApkrCEFikYdZDkNOQwWEGnSwo6q5NS_YKLhfbAP4lBIKF6O_cxb9HhyuJNp84CypWYRM-sy-LsqKlEI1Yg6zThB6UzcwjUnj7A37hq4Hsm_3k4',
  MACAW: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfd_CbyCh6MjXGab4Cr62pYohrH6GPE0ocg1wpOc2xpfTgIOZHL763Ry81lyJweMWrXOzkbgB1YOWXlP_1SrhDwRKVXIR6RlT-srji8rkWmghCRzoF-o1RslKU_pW4ApESlKD_7O5xD8t2RlJ4nMrIEiNhXa6Kcor7PQ2yzSdeNPGS2TNVQPMtXaG5RjS3pd64WU4JjjFwB_g0e_Vd3FGCthT1_L7FTy9lCOG6cYfDxQhDrCc6ukhab2SrpC7z9KQ-fvbN8Pxb0o',
  FOUNDER: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9yNixPb1U6ef8QWY7hVuPjCPve_4oIX0s9R1QQoQv85kMWCMSxxCb1cPwtTt6yAZSAcJ2QgiY0wiMCxkWD2-UgpQHx7K3NOcydvkYNB9nW0KAd7VTxgFewarhdvF29NDKUfJnRcItIQhS_PjfuUwbWKEH7XDhCwA8HeuZt2g9SQY6a-QWSnEh6gXsKaRjrP28sh3XNjD8vyfG3u7rqcNmiX_6RIzEnYJTiQZa6dEjguNxA4vtbLzbmw7a7GYmEeSLFd8hAG4cSzM',
};
